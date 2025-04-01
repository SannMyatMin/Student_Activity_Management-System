package helloworld.backend_SpringBoot.Service;

import java.sql.Date; // Use this instead of util.Date
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;

import helloworld.backend_SpringBoot.DTOs.AllClubs;
import helloworld.backend_SpringBoot.Model.Club;
import helloworld.backend_SpringBoot.Model.Student;
import helloworld.backend_SpringBoot.Repository.ClubRepository;
import org.springframework.stereotype.Service;

@Service
public class ClubService
{
    @Autowired
    private ClubRepository clubRepository;


    public Club getClubDataByName(String club_name) {
        Optional<Club> club = clubRepository.getClubDataByClubName(club_name);
        return club.get();
    }

    public void addClub(String clubName, Student student, byte[] imageByte, String description) {
        Club new_Club = new Club();
        new_Club.setClubName(clubName);
        new_Club.setFounder(student);
        new_Club.setImage(imageByte);
        new_Club.setDescription(description);
        new_Club.setCreatedDate(Date.valueOf(LocalDate.now()));
        clubRepository.save(new_Club);
    }

    public void updateClub(String oldName, String newName, String title, String description, byte[] imageByte) {
        Club existed_club = getClubDataByName(oldName);
        existed_club.setClubName(newName);
        existed_club.setTitle(title);
        existed_club.setDescription(description);
        existed_club.setImage(imageByte);
        clubRepository.save(existed_club);
    }

    public List<AllClubs> getAllClub() {
        List<Club> clubs = clubRepository.getAllClub();
        return clubs.stream()
                    .map(club -> new AllClubs(club.getClubName(), club.getTitle(), club.getImage(), club.getDescription(), club.getCreatedDate()))
                    .collect(Collectors.toList());
    }

    public boolean isClubExisted(String clubName) {
        return clubRepository.existsByClubName(clubName);
    }



}
