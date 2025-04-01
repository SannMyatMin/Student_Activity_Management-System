package helloworld.backend_SpringBoot.Service;

import java.sql.Date; // Use this instead of util.Date
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import helloworld.backend_SpringBoot.DTOs.ClubRequestList;
import helloworld.backend_SpringBoot.DTOs.ClubReqers;
import helloworld.backend_SpringBoot.Model.Club;
import helloworld.backend_SpringBoot.Model.ClubRequests;
import helloworld.backend_SpringBoot.Model.Student;
import helloworld.backend_SpringBoot.Repository.ClubRequestsRepository;

@Service
public class ClubRequestService 
{
    @Autowired
    private ClubRequestsRepository clubReqReop;
    @Autowired
    private StudentService studentService;
    @Autowired
    private ClubService clubService;

    public void storeReqForm(String name, String clubName) {
        Student student = studentService.getStudentByName(name);
        Club club = clubService.getClubDataByName(clubName);
        ClubRequests new_req = new ClubRequests();
        new_req.setClub(club);
        new_req.setStudent(student);
        new_req.setDate(Date.valueOf(LocalDate.now()));
        clubReqReop.save(new_req);
    }
    
    public List<ClubRequestList> getClubReqList(String clubName) {
        List<ClubReqers> Reqers = clubReqReop.getClubReqers(clubName);
        return Reqers.stream()
                .map(Req -> new ClubRequestList(Req.getStudent_name(),
                        Req.getImage(),
                        Req.getDate()))
                .collect(Collectors.toList());
    }

    public boolean isAlreadyReqClub(String studentName, String clubName) {
        Student student = studentService.getStudentByName(studentName);
        Club club = clubService.getClubDataByName(clubName);
        if (clubReqReop.isReqExist(student.getId(), club.getClubId()) > 0) {
            return true;
        } else {
            return false;
        }
    }

    public ClubRequests getReqForm(Integer studentId, Integer clubId) {
        Optional<ClubRequests> reqForm = clubReqReop.findByIDs(studentId, clubId);
        return reqForm.get();
    }
    
    public void removeRequest(String studentName, String clubName) {
        Student student = studentService.getStudentByName(studentName);
        Club club = clubService.getClubDataByName(clubName);
        ClubRequests reqForm = getReqForm(student.getId(),club.getClubId());
        clubReqReop.delete(reqForm);
    }

}
