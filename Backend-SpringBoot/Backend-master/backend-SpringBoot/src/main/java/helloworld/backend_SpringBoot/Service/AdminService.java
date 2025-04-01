package helloworld.backend_SpringBoot.Service;

import java.util.Optional;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import helloworld.backend_SpringBoot.DTOs.Adminprofile;
import helloworld.backend_SpringBoot.DTOs.ClubData;
import helloworld.backend_SpringBoot.DTOs.StudentData;
import helloworld.backend_SpringBoot.Model.Admin;
import helloworld.backend_SpringBoot.Model.Club;
import helloworld.backend_SpringBoot.Model.Forms;
import helloworld.backend_SpringBoot.Repository.AdminRepository;

@Service
public class AdminService 
{
    @Autowired
    private AdminRepository adminRepository;
    @Autowired
    private FormsService formsService;
    @Autowired 
    private ClubService clubService;

    public boolean checkAdminByMail(String Mail) {
        return adminRepository.existsByMail(Mail);
    }

    public Admin getAdminByMail(String Mail) {
        Optional<Admin> Admin = adminRepository.findByMail(Mail);
        return Admin.get();
    }

    public Adminprofile getAdminPfData(String Mail) {
        Admin admin               = getAdminByMail(Mail);
        Adminprofile adminProfile = new Adminprofile(admin.getName(), admin.getMail(), admin.getImage());
        return adminProfile;
    }

    public List<StudentData> getStudentDatas() {
        return adminRepository.getStudentsData();
    }

    public List<ClubData> getClubDatas() {
        return adminRepository.getClubData();
    }


    public void addAdmin(Admin admin) {
        adminRepository.save(admin);
    }

    public void approveClub(String clubName, byte[] imageByte) {
        Forms clubForm = formsService.getFormByTitle(clubName);
        clubService.addClub(clubForm.getTitle(),
                            clubForm.getStudentId(),
                            imageByte,
                            clubForm.getDescription());
    }




}
