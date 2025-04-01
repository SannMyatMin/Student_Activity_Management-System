package helloworld.backend_SpringBoot.Repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import helloworld.backend_SpringBoot.DTOs.ClubData;
import helloworld.backend_SpringBoot.DTOs.StudentData;
import helloworld.backend_SpringBoot.Model.Admin;


@Repository
public interface AdminRepository extends JpaRepository<Admin,Integer>
{
    boolean existsByMail(String mail);

    Optional<Admin> findByMail(String mail);

    @Query(value = """
            SELECT
                s.Name AS name,
                s.Roll_number AS rollNumber,
                s.Gender As gender,
                s.Mail AS mail,
                GROUP_CONCAT(DISTINCT role ORDER BY
                    CASE
                        WHEN role = 'Student' THEN 1
                        WHEN role = 'Shop Owner' THEN 2
                        WHEN role = 'Organizer' THEN 3
                        ELSE 4
                    END, role SEPARATOR ', ') AS role
            FROM student s
            LEFT JOIN (
                -- Student Role
                SELECT Id AS Student_id, 'Student' AS Role FROM student
                UNION ALL
                -- Organizer Role
                SELECT Student_id, 'Organizer' AS Role FROM organizer
                UNION ALL
                -- Club Membership Role
                SELECT Member_id,
                       CASE WHEN Role = 'Founder' THEN 'Club Founder' ELSE 'Club Member' END AS Role
                FROM club_membership
                UNION ALL
                -- Food Court Shop Owner Role
                SELECT Owner_id, 'Shop Owner' AS Role FROM food_court_shop
            ) roles ON s.Id = roles.Student_id
            GROUP BY s.Id, s.Name, s.Roll_number, s.Mail
            ORDER BY s.Name;
            """, nativeQuery = true)
    List<StudentData> getStudentsData();


    @Query(value = """
            SELECT
                c.Club_name AS club_name,
                s.Name AS club_founder,
                COUNT(cm.Member_id) AS number_of_members,
                c.Created_date
            FROM club c
            JOIN student s ON c.Founder_id = s.Id
            LEFT JOIN club_membership cm ON c.Club_id = cm.Club_id
            GROUP BY c.Club_id, c.Club_name, s.Name, c.Created_date
            """, nativeQuery = true)
    List<ClubData> getClubData();
    
} 
