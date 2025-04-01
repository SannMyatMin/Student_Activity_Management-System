package helloworld.backend_SpringBoot.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import helloworld.backend_SpringBoot.DTOs.RequestedClubs;
import helloworld.backend_SpringBoot.DTOs.RequestedShops;
import helloworld.backend_SpringBoot.Model.Forms;

@Repository
public interface FormsRepository extends JpaRepository<Forms,Integer>
{
    @Query(value="""
                    SELECT s.Name as student_name,s.Image as student_image,f.Title as title,f.Description as description 
                    FROM forms as f 
                    JOIN student as s
                    Where f.Student_id=s.Id AND f.type='shop'
                """,nativeQuery=true)
    List<RequestedShops> getRequestedShops();

    @Query(value="""
                    SELECT s.Name as student_name,s.Image as student_image,f.Title as title,f.Description as description
                    FROM forms as f
                    JOIN student as s
                    Where f.Student_id=s.Id AND f.type='club'   
            """, nativeQuery = true)
    List<RequestedClubs> getRequestedClubs();

    @Query(value="""
                SELECT COUNT(*) FROM forms Where Student_id=:id AND title=:title
            """, nativeQuery = true)
    Integer isFormAlreadyExisted(@Param("id") Integer id, @Param("title") String title);

    Optional<Forms> findByTitle(String title);


}
