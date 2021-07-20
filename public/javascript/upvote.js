async function voteClick(event){
    event.preventDefault();
    const Id = window.location.toString().split("/")[
        window.location.toString().split("/").length - 1
    ];
    const response = await fetch("/api/posts/upvote", {
        method: "PUT",
        body: JSON.stringify({
          post_id: id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
    });
      if (response.ok) {document.location.reload();}
    };

    document
      .querySelector(".upvote-btn")
      .addEventListener("click", voteClick);
