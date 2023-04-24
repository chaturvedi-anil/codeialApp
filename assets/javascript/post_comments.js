// Let's implement this via classes

// this class would be initialized for every post on the page
// 1. When the page loads
// 2. Creation of every post dynamically via AJAX

class PostComments
{
    // constructor is used to initialize the instance of the class whenever a new instance is created
    constructor(postId)
    {
        this.postId = postId;
        this.postContainer = $(`#post-${postId}`);
        this.newCommentForm = $(`#post-${postId}-comments-form`);

        this.createComment(postId);

        let self = this;
        // call for all the existing comments
        $(' .delete-comment-button', this.postContainer).each(function(){
            self.deleteComment($(this));
        });
    }

    // method to submit the form data for new comment using ajax
    createComment(postId)
    {
        let pSlef = this;
        
        this.newCommentForm.submit(function(e)
        {
            e.preventDefault();

            let self = this;
            // ajax request
            $.ajax({
                type: 'post',
                url: '/comments/create',
                // this will convert form data into json format
                data: $(self).serialize(),
                success: function(data)
                {
                    let newComment = pSlef.newCommentDom(data.data.comment);
                    $(`#post-comments-${postId}`).prepend(newComment);
                    pSelf.deleteComment($(` .delete-comment-button`, newComment));

                    // CHANGE :: enable the functionality of the toggle like button on the new post 
                    new ToggleLike($(' .toggle-like-btn', newComment));
                },
                error: function(error)
                {
                    console.log('error in create comment ajax ',error.responseText);
                }
            });
        });
    }

    // method to create a comment in dom
    newCommentDom(comment)
    {
        // CHANGE :: show the count of zero likes on this comment
        return $(`
            <li id="comment-${comment._id}">
                <p>
                    <small>
                        <a class="delete-comment-button" href="/comments/destroy/${comment._id}"> X </a>
                    </small>
                    ${comment.content}
                    <br>
                    <small>
                        ${comment.user.name}
                    </small>
                    <br>
                    <small>
                        <a class="toggle-like-btn" data-likes="0" href="/likes/toggle/?id=${comment._id}&type=Comment">
                            0 Likes
                        </a>
                    </small>
                </p>    
            </li>
        `);
    }

    // method to delete comment from dom 
    deleteComment(deleteLink)
    {
        $(deleteLink).click(function(e)
        {
            e.preventDefault();
            
            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data)
                {
                    $(`#comment-${data.data.comment._id}`).remove();
                },
                error: function(err)
                {
                    console.log(error.responseText);
                }
            });
        });
    }
}