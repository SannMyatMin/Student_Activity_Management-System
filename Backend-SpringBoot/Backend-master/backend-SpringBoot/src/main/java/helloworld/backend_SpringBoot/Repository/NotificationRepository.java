package helloworld.backend_SpringBoot.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import helloworld.backend_SpringBoot.Model.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification,Integer>
{

}
