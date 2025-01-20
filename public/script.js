const bodyProject = document.querySelector(".body-project");
function getProject() {
  bodyProject.innerHTML = '<div class="loading"></div>';
  fetch("http://localhost:5500/project")
    .then((res) => {
      if (!res.ok) {
        bodyProject.innerHTML = "terjadi kesalahan";
        throw new Error("terjadi kesalahan");
      }
      return res.json();
    })
    .then((data) => {
      bodyProject.innerHTML = "";
      data.forEach((dt) => {
        bodyProject.innerHTML += `
          <div class="brd-project">
            <h2>${dt.nama}</h2>
            <hr />
            <div class="brd-img">
              <img src="img/${dt.img}" alt="" />
            </div>
            <hr />
            <div>
              <a href=${dt.linkPreview} class="link">Link Preview</a>
              <a href=${dt.linkCode} class="link">Link Code</a>
              <a href="/delete/${dt.id}" class="link">Delete</a>
              <a href="/edit/${dt.id}" class="link">Edit</a>
            </div>
          </div>
    `;
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
getProject();
