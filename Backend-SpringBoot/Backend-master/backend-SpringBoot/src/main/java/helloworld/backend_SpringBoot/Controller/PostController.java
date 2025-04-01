package helloworld.backend_SpringBoot.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import helloworld.backend_SpringBoot.DTOs.Club_names;
import helloworld.backend_SpringBoot.Service.PostService;

@CrossOrigin
@RestController
@RequestMapping("/post")
public class PostController 
{
    @Autowired
    private PostService postService;

    @PostMapping("/addPost")
    public ResponseEntity<String> posting(@RequestParam("creator") String crator_name,
                                          @RequestParam("title") String title,
                                          @RequestParam("poster_name") String poster_name,
                                          @RequestParam("caption") String caption,    
                                          @RequestParam("content") String content,
                                          @RequestParam(value = "image", required = false) MultipartFile image,
                                          @RequestParam("visibility") String visibility)
    {
        try {
            byte[] imageByte = null;
            if(image != null){
                imageByte = image.getBytes();
            };
            postService.addPost(crator_name, title, poster_name, caption, content, imageByte, visibility);
            return ResponseEntity.ok("Post added");
        } catch (Exception E) {
            E.printStackTrace();
            return ResponseEntity.status(401).body("Fail");
        }
    }

    @PostMapping("/getClubPosts")
    public ResponseEntity<Object> getClubPosts(@RequestBody Map<String, Object> post_req) {
        ObjectMapper objMapper = new ObjectMapper();
        List<Club_names> club_names = objMapper.convertValue(post_req.get("club_names"),
                new TypeReference<List<Club_names>>() {
                });
        try {
            return ResponseEntity.ok(postService.getClubPosts(club_names));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body("Fail");
        }

    }
   
    @GetMapping("/getAllPosts")
    public ResponseEntity<Object> getEventPosts() {
        try {
            return ResponseEntity.ok(postService.getAllPosts());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body("fail");
        }
    }
    
    @PostMapping("/updatePost")
    public ResponseEntity<String> updatePost(@RequestParam("post_id") Integer post_id,
                                             @RequestParam("title") String title,
                                             @RequestParam("caption") String caption,
                                             @RequestParam("content") String content,
                                             @RequestParam(value = "image", required = false) MultipartFile image,
                                             @RequestParam("visibility") String visibility)
    {
        try {
            byte[] imageByte = null;
            if (image != null) {
                imageByte = image.getBytes();
            }
            postService.updatePost(post_id, title, caption, content, imageByte, visibility);
            return ResponseEntity.ok("Post updated");
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Fail");
        }

    }
    
    @PostMapping("/deletePost")
    public ResponseEntity<String> deletePost(@RequestBody Map<String,Integer> post) {
        try{
            postService.deletePost(post.get("post_id"));
            return ResponseEntity.ok("Post deleated");
        }
        catch (Exception e) {
            return ResponseEntity.status(401).body("Fail");
        }
    }
}
