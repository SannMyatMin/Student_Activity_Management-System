package helloworld.backend_SpringBoot.Repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import helloworld.backend_SpringBoot.DTOs.StudentProfileDTO;
import helloworld.backend_SpringBoot.Model.Student;



@Repository
public interface StudentRepository extends JpaRepository<Student,Integer>
{
    boolean existsByMail(String mail);

    boolean existsByName(String name);

    Optional<Student> findByMail(String mail);

    @Query(value="""
                SELECT * FROM student WHERE name=:name
            """, nativeQuery = true)
    Optional<Student> searchBy_Name(@Param("name") String name);

    @Query(value = """
                SELECT
                s.name,
                s.roll_number AS rollNumber,
                s.mail,
                s.image,
                COALESCE(
                    GROUP_CONCAT(DISTINCT roles_table.role ORDER BY
                        CASE
                            WHEN roles_table.role = 'Student' THEN 1
                            WHEN roles_table.role LIKE 'Founder of%' THEN 2
                            WHEN roles_table.role = 'Organizer' THEN 3
                            WHEN roles_table.role LIKE 'Owner of%' THEN 4
                            ELSE 5
                        END, roles_table.role SEPARATOR ', '
                    ), 'Student'
                ) AS roles,
                GROUP_CONCAT(DISTINCT c2.club_name SEPARATOR ', ') AS joinedClubs
            FROM student s
            LEFT JOIN (
                -- Default Student Role
                SELECT id AS student_id, 'Student' AS role FROM student
                UNION ALL
                -- Club Founder Role
                SELECT founder_id AS student_id, CONCAT('Founder of ', club_name) AS role FROM club
                UNION ALL
                -- Organizer Role
                SELECT student_id, 'Organizer' AS role FROM organizer
                UNION ALL
                -- Food Court Shop Owner Role
                SELECT owner_id AS student_id, CONCAT('Owner of ', shop_name) AS role FROM food_court_shop
            ) roles_table ON roles_table.student_id = s.id
            LEFT JOIN club_membership cm ON cm.member_id = s.id
            LEFT JOIN club c2 ON cm.club_id = c2.club_id
            WHERE s.mail = :mail
            GROUP BY s.id;
            """, nativeQuery = true)
    Optional<StudentProfileDTO> getStudentProfileByMail(String mail);

}
