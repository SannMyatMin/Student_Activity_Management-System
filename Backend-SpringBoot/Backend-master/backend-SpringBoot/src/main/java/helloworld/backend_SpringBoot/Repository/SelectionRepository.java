package helloworld.backend_SpringBoot.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import helloworld.backend_SpringBoot.DTOs.SelectionData;
import helloworld.backend_SpringBoot.Model.Selection;

@Repository
public interface SelectionRepository extends JpaRepository<Selection,Integer>
{
    @Query(value = """
            SELECT s.Name as name,  s.roll_number as roll_number, s.Gender as gender, se.Image as image 
            FROM student s 
            JOIN selection se 
            ON s.Id=se.Student_id;
            """, nativeQuery = true)
    List<SelectionData> getSelectionData();

    @Query(value="""
            SELECT * FROM selection WHERE Student_id=:student_id
            """, nativeQuery=true)
    Optional<Selection> findByStudentId(@Param("student_id") Integer student_id);

    @Query(value = """
                    SELECT * FROM selection WHERE Role=:role
                    """, nativeQuery = true)
    Optional<Selection> findByRole(@Param("role") String role);

    

}
