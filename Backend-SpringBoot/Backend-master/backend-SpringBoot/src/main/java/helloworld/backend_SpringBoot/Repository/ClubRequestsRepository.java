package helloworld.backend_SpringBoot.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import helloworld.backend_SpringBoot.DTOs.ClubReqers;
import helloworld.backend_SpringBoot.Model.ClubRequests;

@Repository
public interface ClubRequestsRepository extends JpaRepository<ClubRequests,Integer>
{
    @Query(value="""
                 SELECT s.Name as student_name,s.Image as image,c.date as date 
                 FROM student s 
                 JOIN club_requests c ON s.Id = c.Student_id 
                 JOIN club cb ON cb.Club_id = c.Club_id 
                 WHERE cb.Club_name=:club_name
            """,nativeQuery = true)
    List<ClubReqers> getClubReqers(@Param("club_name") String club_name);


    @Query(value = """
                   SELECT COUNT(*) FROM club_requests WHERE Student_id=:s_id AND Club_id=:c_id
            """, nativeQuery = true)
    Integer isReqExist(@Param("s_id") Integer Student_id, @Param("c_id") Integer Club_id);


    @Query(value = """
                   SELECT * FROM club_requests WHERE Student_id=:id AND Club_id=:c_id
            """, nativeQuery = true)
    Optional<ClubRequests> findByIDs(@Param("id") Integer id, @Param("c_id") Integer c_id);
}
