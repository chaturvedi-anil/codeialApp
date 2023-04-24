// CHANGE :: create a class to toggle likes when a link is clicked, using AJAX
class ToggleLike
{
    constructor(toggleElement)
    {
        this.toggler = toggleElement;
        this.toggleLike();  
    }

    toggleLike()
    {
        console.log('inside togglerlike');
        $(this.toggler).click(function(e)
        {
            e.preventDefault();
            let self = this;
            console.log('inside toggler click');
            // this is a new way of writing ajax , its look like same as promises
            $.ajax({
                type:'POST',
                url: $(self).attr('href'),
            })
            .done(function(data)
            {
                console.log('inside done');
                let likesCount = parseInt($(self).attr('data-likes'));
                console.log(likesCount);

                if(data.data.deleted == true)
                {
                    likesCount -=1;
                }
                else
                {
                    likesCount +=1;
                }

                $(self).attr('data-likes', likesCount);
                $(self).html(`${likesCount} Likes`);
            })
            .fail(function(errData)
            {
                console.log('Error in completing the request from toggle_likes.js');
            });
        });
    }
}