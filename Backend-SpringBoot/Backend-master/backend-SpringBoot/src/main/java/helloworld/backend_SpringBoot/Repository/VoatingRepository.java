package helloworld.backend_SpringBoot.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import helloworld.backend_SpringBoot.DTOs.WonSelections;
import helloworld.backend_SpringBoot.Model.Voating;
import jakarta.transaction.Transactional;

@Repository
public interface VoatingRepository extends JpaRepository<Voating,Integer>
{
    @Modifying
    @Transactional
    @Query(value = """
            UPDATE selection se
            SET se.Role = :position
            WHERE se.Selection_id = (
                SELECT v.Selection_id
                FROM voating v
                WHERE v.position = :position
                GROUP BY v.Selection_id
                ORDER BY COUNT(*) DESC, MIN(v.Selection_id) ASC
                LIMIT 1
            )
            """, nativeQuery = true)
    int choosePosition(@Param("position") String position);

    @Query(value="""
                SELECT stu.Name AS name, stu.roll_number AS roll_number, se.Image AS image, se.role AS position
                FROM selection se
                JOIN student stu
                ON stu.Id = se.Student_id
                WHERE se.Role IN ('King','Queen','Prince','Princess','Mr.Popular','Mrs.Popular')
           """, nativeQuery = true)
    List<WonSelections> getWinners();
    
    @Modifying
    @Transactional
    @Query(value = """
            DELETE FROM voating WHERE Selection_id = :id
            """, nativeQuery = true)
    void removeVotes(@Param("id") Integer id);

}
