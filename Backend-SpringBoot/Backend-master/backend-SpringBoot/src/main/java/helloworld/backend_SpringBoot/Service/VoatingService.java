package helloworld.backend_SpringBoot.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import helloworld.backend_SpringBoot.DTOs.Winners;
import helloworld.backend_SpringBoot.DTOs.WonSelections;
import helloworld.backend_SpringBoot.Model.Selection;
import helloworld.backend_SpringBoot.Model.Student;
import helloworld.backend_SpringBoot.Model.Voating;
import helloworld.backend_SpringBoot.Repository.VoatingRepository;

@Service
public class VoatingService 
{
    @Autowired
    private VoatingRepository voatingRepo;
    @Autowired
    private StudentService studentService;
    @Autowired
    private SelectionService selectionService;

    public void addVote(String voaterName, String selectionName, String position) {
        Student student = studentService.getStudentByName(voaterName);
        Student selection = studentService.getStudentByName(selectionName);
        Selection S_election = selectionService.getSelectionByStudent_id(selection.getId());
        Voating new_vote = new Voating();
        new_vote.setSelection_id(S_election);
        new_vote.setStudent_id(student);
        new_vote.setPosition(position);
        voatingRepo.save(new_vote);
    }

    public void chooseWinner() {
        List<String> positions = new LinkedList<>(Arrays.asList(
                            "King", "Queen", "Prince", "Princess", "Mr.Popular", "Mrs.Popular"));
        for (String position : positions) {
            if (voatingRepo.choosePosition(position)!=0) {
                Selection selection = selectionService.getSelectionByRole(position);
                voatingRepo.removeVotes(selection.getSelection_id());
            }
        }
    }


    public List<Winners> getWinners() {
        chooseWinner();
        List<WonSelections> wonSelections = voatingRepo.getWinners();
        return wonSelections.stream()
                            .map(W -> new Winners( W.getName(),W.getRoll_number(),
                                                   W.getImage(),W.getPosition()))
                            .collect(Collectors.toList());
    }

}
