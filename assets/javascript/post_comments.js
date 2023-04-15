{
    // method to submit the form data for new comment using ajax
    let createComment= function()
    {
        let newCommentForm = $(`#new-comment-form`);
        
        newCommentForm.submit(function(e)
        {
            e.preventDefault();

            // ajax request
            $.ajax({
                type: 'post',
                url: '/comments/create',
                // this will convert form data into json format
                data: newCommentForm.serialize(),
                success: function(data)
                {
                    let newComment = newCommentDom(data.data.comment);
                    $(`#post-commnets-container>ul`, newComment).prepend();
                },
                error: function(error)
                {
                    console.log(error.responseText);
                }
            });
        });
    }

    // method to create a comment in dom
    let newCommentDom = function(comment)
    {
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
                </p>    
            </li>
        `);
    }

    createComment();
}