package helloworld.backend_SpringBoot.Security;

import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class ArgonTwo
{
    public Argon2PasswordEncoder argon2Encoder()
    {
        int saltLength  = 6;
        int hashLength  = 18;
        int parallelism = 2;
        int memory      = 65536;
        int iteration   = 3;

        Argon2PasswordEncoder encoder = new Argon2PasswordEncoder(saltLength, 
                                                                  hashLength,
                                                                  parallelism,
                                                                  memory,
                                                                  iteration);

        return encoder;
    }
}
