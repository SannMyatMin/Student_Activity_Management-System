package helloworld.backend_SpringBoot.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import helloworld.backend_SpringBoot.DTOs.ClubPeople;
import helloworld.backend_SpringBoot.Model.ClubMembership;
import jakarta.transaction.Transactional;

@Repository
public interface ClubMembershipRepository extends JpaRepository<ClubMembership,Integer>
{

    @Query(value="""
                 SELECT s.Name as name,s.Image as image,m.Role as role,m.Joined_date as date
                 FROM student s JOIN club_membership m JOIN club c
                 ON s.Id=m.Member_Id AND m.Club_id=c.Club_id
                 WHERE c.Club_name=:club_name;
            """, nativeQuery=true)
    List<ClubPeople> getClubPeople(@Param("club_name") String club_name);


    @Query(value="""
            SELECT COUNT(*) FROM club_membership WHERE Member_id=:student_id AND Club_id=:club_id
            """, nativeQuery = true)
    Integer getMembership(@Param("student_id") Integer student_id, @Param("club_id") Integer club_id);

    @Modifying
    @Transactional
    @Query(value = """
                DELETE FROM club_membership WHERE Member_id=:student_id AND Club_id=:club_id
                """, nativeQuery = true)
    int removeFromClub(@Param("student_id") Integer student_id, @Param("club_id") Integer club_id);
}
