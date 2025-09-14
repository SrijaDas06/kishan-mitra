function generateBio() {
      // Get form values
      const name = document.getElementById("name").value;
      const age = document.getElementById("age").value;
      const className = document.getElementById("class").value;
      const subjects = document.getElementById("subjects").value;
      const about = document.getElementById("about").value;

      // Display them in output section
      document.getElementById("outName").innerText = name;
      document.getElementById("outAge").innerText = age;
      document.getElementById("outClass").innerText = className;
      document.getElementById("outSubjects").innerText = subjects;
      document.getElementById("outAbout").innerText = about;

      // Show the bio section
      document.getElementById("outputSection").style.display = "block";
    }