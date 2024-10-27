document.getElementById("upload-form").onsubmit = async function (event) {
    event.preventDefault();
    
    const formData = new FormData();
    const videoFile = document.querySelector('input[type="file"]').files[0];
    formData.append("video", videoFile);
    
    const response = await fetch("/upload", {
        method: "POST",
        body: formData
    });
    
    const result = await response.json();
    document.getElementById("message").textContent = result.message;
    
    if (response.ok) {
        const videoElement = document.getElementById("output-video");
        videoElement.src = result.output_url;
        videoElement.style.display = "block";
    }
};
