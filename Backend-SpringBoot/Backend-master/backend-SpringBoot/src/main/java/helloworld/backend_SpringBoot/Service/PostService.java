package helloworld.backend_SpringBoot.Service;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import helloworld.backend_SpringBoot.DTOs.Club_names;
import helloworld.backend_SpringBoot.DTOs.Posts;
import helloworld.backend_SpringBoot.Model.Post;
import helloworld.backend_SpringBoot.Model.Student;
import helloworld.backend_SpringBoot.Repository.PostRepository;

@Service
public class PostService 
{
    @Autowired
    private PostRepository postRepo;
    @Autowired
    private StudentService studentService;

    public void addPost(String creator_name, String title, String poster_name, String caption,
                        String content, byte[] imageByte, String visibility) {
        Student creator = studentService.getStudentByName(creator_name);
        Post new_post = new Post();
        new_post.setCreator(creator);
        new_post.setTitle(title);
        new_post.setPoster_name(poster_name);
        new_post.setCaption(caption);
        new_post.setContent(content);
        new_post.setImage(imageByte);
        new_post.setVisibility(visibility);
        new_post.setCreated_time(Time.valueOf(LocalTime.now()));
        new_post.setCreated_date(Date.valueOf(LocalDate.now()));
        postRepo.save(new_post);
    }

    /* 
    public Post getPostByVisibility(String visibility) {
        Optional<Post> post = postRepo.getPostByVisibility(visibility);
        return post.get();
    }
    */

    public List<Posts> getClubPosts(List<Club_names> list) {
        List<Posts> club_posts = new ArrayList<>();
        for (Club_names name : list) {
            List<Post> post = postRepo.getPostByVisibility(name.getClub_name());
            for (Post c_post : post)
                club_posts.add(new Posts(c_post.getPost_id(), c_post.getCreator().getName(),
                        c_post.getTitle(), c_post.getPoster_name(), c_post.getCaption(),
                        c_post.getContent(), c_post.getImage(), c_post.getVisibility(),
                        c_post.getCreated_date(), c_post.getCreated_time()));
        }
        return club_posts;
    }
    
    public List<Posts> getAllPosts() {
        List<Posts> all_posts = new ArrayList<>();
        List<Post> posts = postRepo.getAllPosts();
        for (Post P : posts) {
            all_posts.add(new Posts(P.getPost_id(), P.getCreator().getName(),
                    P.getTitle(), P.getPoster_name(), P.getCaption(),
                    P.getContent(), P.getImage(),
                    P.getVisibility(),
                    P.getCreated_date(), P.getCreated_time()));
        }
        return all_posts;
    }
    
    public Post getPostById(Integer post_id) {
        Optional<Post> post = postRepo.findById(post_id);
        return post.get();
    }
    
    public void updatePost(Integer post_id, String title, String caption, String content, byte[] imageByte, String visibility) {
        Post post = getPostById(post_id);
        post.setTitle(title);
        post.setContent(content);
        post.setCaption(caption);
        post.setImage(imageByte);
        post.setVisibility(visibility);
        postRepo.save(post);
    }

    public void deletePost(Integer post_id) {
        Post post = getPostById(post_id);
        postRepo.delete(post);
    }

}
