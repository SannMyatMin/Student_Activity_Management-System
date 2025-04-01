package helloworld.backend_SpringBoot.Repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import helloworld.backend_SpringBoot.Model.Club;

@Repository
public interface ClubRepository extends JpaRepository<Club,Integer>
{

    boolean existsByClubName(String clubName);

    Optional<Club> getClubDataByClubName(String club_name);

    @Query(value="""
                 SELECT * FROM club
            """, nativeQuery = true)
    List<Club> getAllClub();
}
