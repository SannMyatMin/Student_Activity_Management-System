package helloworld.backend_SpringBoot.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import helloworld.backend_SpringBoot.DTOs.SelectionData;
import helloworld.backend_SpringBoot.DTOs.SelectionDataEx;
import helloworld.backend_SpringBoot.Model.Selection;
import helloworld.backend_SpringBoot.Model.Student;
import helloworld.backend_SpringBoot.Repository.SelectionRepository;

@Service
public class SelectionService 
{
    @Autowired
    private SelectionRepository selectionRepo;
    @Autowired
    private StudentService studentService;;

    public void addSelection(String name, byte[] imageByte) {
        Student student = studentService.getStudentByName(name);
        Selection new_selection = new Selection();
        new_selection.setStudentId(student);
        new_selection.setImage(imageByte);
        selectionRepo.save(new_selection);
    }

    public List<SelectionDataEx> getAllSelections() {
        List<SelectionData> data = selectionRepo.getSelectionData();
        return data.stream()
                   .map(D -> new SelectionDataEx(D.getName(), 
                                                 D.getRoll_number(), 
                                                 D.getGender(),
                                                 D.getImage()))
                   .collect(Collectors.toList());

    }

    public void addImage(String name, byte[] imageByte) {
        Student student = studentService.getStudentByName(name);
        Selection selection = getSelectionByStudent_id(student.getId());
        selection.setImage(imageByte);
        selectionRepo.save(selection);
    }


    public Selection getSelectionByStudent_id(Integer Student_id) {
        Optional<Selection> selection = selectionRepo.findByStudentId(Student_id);
        return selection.get();
    }

    public Selection getSelectionByRole(String role) {
        Optional<Selection> selection = selectionRepo.findByRole(role);
        return selection.get();
    }
    

    
}
