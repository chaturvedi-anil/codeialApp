{
    // method to submit the form data for new post using ajax
    let createPost = function()
    {
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(e)
        {
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                // this will convert form data into json format 
                data: newPostForm.serialize(),
                success: function(data)
                {
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($(` .delete-post-button`, newPost));

                    // call the create comment class
                    new PostComments(data.data.post._id);

                    // CHANGE :: enable the functionality of the toggle like button on the new post 
                    new ToggleLike($(' .toggle-like-btn', newPost));
                },
                error: function(error)
                {
                    console.log('error in create post ajax ',error.responseText);
                } 
            }); 
        });
    }

    // method to create a post in dom
    let newPostDom = function(post)
    {
        // CHANGE :: show the count of zero likes on this post
        return $(`<li id="post-${post._id}">
                    <p>
                        <small>
                            <a class="delete-post-button" href="/posts/destroy/${post._id}"> X </a>
                        </small>
                        ${post.content} <br>
                        <small>
                            ${post.user.name} 
                        </small>
                        <br>
                        <small>
                            <a class="toggle-like-btn" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                                0 Likes
                            </a>
                        </small>
                    </p>
                    <div id="post-comment">
                        <!-- for comments -->
                        <form id="post-${post._id}-comments-form" action="/comments/create" method="post">
                            <input type="text" name="content" placeholder="type here to add Comment..." required>
                            <input type="hidden" name="post" value="${post._id}">
                            <input type="submit" value="Add Comment">
                        </form>    
                    </div>
                
                    <div id="post-comments-list">
                        <ul id="post-comment-${post._id}">

                        </ul>
                    </div>
                </li>
        `);
    }

    // method to delete post from dom

    let deletePost = function(deleteLink)
    {
        $(deleteLink).click(function(e)
        {
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data)
                {
                    $(`#post-${data.data.post._id}`).remove();
                },
                error: function(err)
                {
                    console.log(error.responseText);
                }
            })
        })
    }

    // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
    let convertPostsToAjax = function(){
        $('#posts-list-container>ul>li').each(function(){
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);

            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1]
            new PostComments(postId);
        });
    }
    createPost();
    convertPostsToAjax();
}