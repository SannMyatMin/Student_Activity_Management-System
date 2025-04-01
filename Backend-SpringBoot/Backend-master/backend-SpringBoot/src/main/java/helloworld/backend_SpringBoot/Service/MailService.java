package helloworld.backend_SpringBoot.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService 
{
    @Autowired
    private JavaMailSender JMailSender;

    private final Map<String,Integer> OTP = new HashMap<>(); 

    public void sendOTP(String mail)
    {
        int otp = new Random().nextInt(1000000);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(mail);
        message.setSubject("OTP code for registration");
        message.setText("Your verification numer is "+otp);
    
        OTP.put(mail,otp);
        JMailSender.send(message);
    };

    public boolean isOTPCorrect(String mail,int otp)
    {
        if(otp == OTP.get(mail))
        {
            OTP.remove(mail);
            return true;
        }
        else
        {
            return false;
        }
    };



}
