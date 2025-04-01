package helloworld.backend_SpringBoot.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import helloworld.backend_SpringBoot.DTOs.ClubMembers;
import helloworld.backend_SpringBoot.DTOs.ClubPeople;
import helloworld.backend_SpringBoot.Model.Club;
import helloworld.backend_SpringBoot.Model.ClubMembership;
import helloworld.backend_SpringBoot.Model.Student;
import helloworld.backend_SpringBoot.Repository.ClubMembershipRepository;

@Service
public class ClubMembershipService 
{
    @Autowired
    private ClubMembershipRepository membershipRepo;
    @Autowired
    private StudentService studentService;
    @Autowired
    private ClubService clubService;


    public void addFounder(String studentName, String clubName) {
        Student founder           = studentService.getStudentByName(studentName);
        Club club                 = clubService.getClubDataByName(clubName);
        ClubMembership membership = new ClubMembership();
        membership.setMember(founder);
        membership.setClub(club);
        membership.setRole("founder");
        membership.setJoined_date(Date.valueOf(LocalDate.now()));
        membershipRepo.save(membership);
    }


    public void addMembership(String studentName, String clubName) {
        Student student = studentService.getStudentByName(studentName);
        Club club = clubService.getClubDataByName(clubName);
        ClubMembership memberShip = new ClubMembership();
        memberShip.setMember(student);
        memberShip.setClub(club);
        memberShip.setRole("member");
        memberShip.setJoined_date(Date.valueOf(LocalDate.now()));
        membershipRepo.save(memberShip);
    }
    

    public List<ClubMembers> getClubMembers(String clubName) {
        List<ClubPeople> memberList = membershipRepo.getClubPeople(clubName);
        return memberList.stream()
                .map(list -> new ClubMembers(list.getName(), list.getImage(), list.getRole(), list.getDate()))
                .collect(Collectors.toList());
    }
    

    public boolean isAlreadyInClub(String studentName, String clubName) {
        Student student = studentService.getStudentByName(studentName);
        Club club = clubService.getClubDataByName(clubName);

        if (membershipRepo.getMembership(student.getId(), club.getClubId()) > 0) {
            return true;
        } else {
            return false;
        }
    }
    
    public void removeFromClub(String student_name, String club_name) {
        Student student = studentService.getStudentByName(student_name);
        Club club       = clubService.getClubDataByName(club_name);
        membershipRepo.removeFromClub(student.getId(), club.getClubId());
    }

}
