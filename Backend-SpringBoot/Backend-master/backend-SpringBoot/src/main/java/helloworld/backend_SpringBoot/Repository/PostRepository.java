package helloworld.backend_SpringBoot.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import helloworld.backend_SpringBoot.Model.Post;

@Repository
public interface PostRepository extends JpaRepository<Post,Integer>
{
    @Query(value = """
                SELECT * FROM post WHERE Visibility=:visibility
            """, nativeQuery = true)
    List<Post> getPostByVisibility(@Param("visibility") String visibility);

    @Query(value="""
                SELECT * FROM post
            """, nativeQuery = true)
    List<Post> getAllPosts();
}
