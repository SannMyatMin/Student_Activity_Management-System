package helloworld.backend_SpringBoot.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import helloworld.backend_SpringBoot.Model.Organizer;
import helloworld.backend_SpringBoot.Model.Student;

@Repository
public interface OrganizerRepository extends JpaRepository<Organizer,Integer>
{
    Organizer findByStudentId(Student student);
}
