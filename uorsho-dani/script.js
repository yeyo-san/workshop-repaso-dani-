class Utilities {
    static generateId() {
      return Utilities.increment++;
    }
  
    static generateToken() {
      return Math.random().toString(36).substring(2);
    }
  }
  
  Utilities.increment = 0;
  
  class User {
    constructor(name, email, role) {
      this.name = name;
      this.email = email;
      this.role = role;
    }
  
    static createUser(name, email, role) {
      const id = Utilities.generateId();
      const token = Utilities.generateToken();
      const user = new User(name, email, role);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      return user;
    }
  
    static logOut() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      location.reload();
    }
  
    static getCurrentUser() {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    }
  }
  
  class RegularUser extends User {
    constructor(name, email, role) {
      super(name, email, role);
    }
  
    renderRegular() {
      const $container = document.getElementById("container");
      $container.innerHTML = "";
      $container.innerHTML += /*html*/ `
          <h2>Regular User</h2>
          <p>Welcome, ${this.name}!</p>
          <button onclick="User.logOut()">Logout</button>
          `;
    }
  }
  
  class AdminUser extends User {
    constructor(name, email, role) {
      super(name, email, role);
    }
  
    renderAdmin() {
      const $container = document.getElementById("container");
      $container.innerHTML = "";
      $container.innerHTML += /*html*/ `
            <div class="flex flex-col h-screen gap-4 ">
              <h1 class="text-3xl p-4">Welcome ${this.name}</h1>

              <div class="bg-yellow-200/70 w-80 ml-4 p-10 gap-4 rounded-2xl shadow-2xl">
                <h2>Create a Booking</h2>
                <form id="bookingForm">
                  <label for="departure">Departure:</label>

                  <input type="text" id="departure" name="departure" required>

                  <label for="destination">Destination:</label>

                  <input type="text" id="destination" name="destination" 
                  required>

                  <label for="date">Date:</label>

                  <input type="date" id="date" name="date" required>

                  <label for="time">Time:</label>

                  <input type="time" id="time" name="time" required>

                  <button type="submit">Submit</button>
                </form>
              </div>
             
              <div class="flex justify-end h-full items-">
                <button onclick= "User.logOut()">Logout</button>
                <div id="bookingsList">

                </div>
              </div>
            </div>            
            
          `;
      const $bookingForm = document.getElementById("bookingForm");
      const $departure = document.getElementById("departure");
      const $destination = document.getElementById("destination");
      const $date = document.getElementById("date");
      const $time = document.getElementById("time");
  
      $bookingForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const departure = $departure.value;
        const destination = $destination.value;
        const date = $date.value;
        const time = $time.value;
  
        const booking = Bookings.createBooking(
          departure,
          destination,
          date,
          time
        );
        Bookings.saveBooking(booking);
  
        alert(
          `Booking created successfully from ${departure} to ${destination} on ${date} at ${time}!`
        );
  
        Bookings.showBookings();
      });
  
      // Mostrar las reservas inicialmente
      Bookings.showBookings();
    }
  }
  
  class Bookings {
    constructor(id, departure, destination, date, time) {
      this.id = Utilities.generateId();
      this.departure = departure;
      this.destination = destination;
      this.date = date;
      this.time = time;
    }
  
    static createBooking(departure, destination, date, time) {
      const id = Utilities.generateId();
      return new Bookings(id, departure, destination, date, time);
    }
  
    static saveBooking(booking) {
      let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
      bookings.push(booking);
      localStorage.setItem("bookings", JSON.stringify(bookings));
    }
  
    static deleteBooking(id) {
      const option = confirm("are you sure you want to delete this bookin");
      if (option) {
        let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
        bookings = bookings.filter((booking) => booking.id !== id);
        localStorage.setItem("bookings", JSON.stringify(bookings));
        alert("Booking deleted successfully!");
        window.location.reload();
      }
    }
  
    static editBooking(id) {
      let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
      const booking = bookings.find((booking) => booking.id === id);
  
      if (!booking) return;
  
      const $container = document.getElementById("container");
      $container.innerHTML = /*html*/ `
            <h2>Edit Booking</h2>
            <form id="editBookingForm">
              <label for="editDeparture">Departure:</label>
              <input type="text" id="editDeparture" name="editDeparture" value="${booking.departure}" required>
              <br><br>
              <label for="editDestination">Destination:</label>
              <input type="text" id="editDestination" name="editDestination" value="${booking.destination}" required>
              <br><br>
              <label for="editDate">Date:</label>
              <input type="date" id="editDate" name="editDate" value="${booking.date}" required>
              <br><br>
              <label for="editTime">Time:</label>
              <input type="time" id="editTime" name="editTime" value="${booking.time}" required>
              <br><br>
              <button type="submit">Submit</button>
            </form>
          `;
  
      const $editBookingForm = document.getElementById("editBookingForm");
      $editBookingForm.addEventListener("submit", (event) => {
        event.preventDefault();
        booking.departure = document.getElementById("editDeparture").value;
        booking.destination = document.getElementById("editDestination").value;
        booking.date = document.getElementById("editDate").value;
        booking.time = document.getElementById("editTime").value;
  
        localStorage.setItem("bookings", JSON.stringify(bookings));
        alert("Booking updated successfully!");
        window.location.reload();
      });
    }
  
    static showBookings() {
      const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
      const $bookingsList = document.getElementById("bookingsList");
      $bookingsList.innerHTML = ""; // Clear previous content
  
      bookings.forEach((booking) => {
        const bookingElement = document.createElement("div");
        bookingElement.innerHTML = /*html*/ `
          <div class="flex flex-col items-start justify-center">
        <p><strong>Departure:</strong> ${booking.departure}</p>
        <p><strong>Destination:</strong> ${booking.destination}</p>
        <p><strong>Date:</strong> ${booking.date}</p>
        <p><strong>Time:</strong> ${booking.time}</p>
        <button onclick="Bookings.deleteBooking(${booking.id})">Delete</button>
        <button onclick="Bookings.editBooking(${booking.id})">Edit</button>
        <hr>
      </div>
          `;
        $bookingsList.appendChild(bookingElement);
      });
    }
  }
  

  //Funcion para la carga del registro, y checkea que hay en el localstorage para saber que renderiazar
  const $container = document.getElementById("container");
  
  function registerForm() {
    $container.innerHTML = /*html*/ `
          <div class="flex items-center justify-center h-screen">
            <div class="flex flex-col bg-yellow-200/70 p-14 gap-4 rounded-2xl shadow-2xl">
                <h1 class="text-center text-3xl mb-4 drop-shadow-xl">Register</h1>
                <form id="registerForm">
                    <i class='bx bxs-user text-white bg-black p-2 rounded-sm'></i>
                    <input class="p-1.5 relative right-1 bottom-0.5 rounded-r-md text-center text-sm w-56" type="text" id="username" name="username" placeholder="Nombre de usuario" required>
                    <br><br>
                    <i class='bx bxs-envelope text-white bg-black p-2 rounded-sm'></i>
                    <input class="p-1.5 relative right-1 bottom-0.5 rounded-r-md text-center text-sm w-56" type="email" id="email" name="email" placeholder="Correo electronico" required>
                    <br><br>
                    <label class='text-white bg-black p-1.5 rounded-l-sm' for="role">Role</label>
                    <select class="p-2.5 text-center relative right-1 bottom-0.5 w-52 h-10 text-sm text-white bg-black rounded-r-md" id="role" name="role" required>
                        <option value="" disabled selected class="">Select Role</option>
                        <option value="Admin">Admin</option>
                        <option value="Regular">Regular</option>
                    </select>
                    <br><br>
                    <button class="text-white bg-amber-950/80 p-2 rounded-r-md w-full text-sm" type="submit">Submit</button>
                </form>
            </div>
          </div>
      `;
  
    const $registerForm = document.getElementById("registerForm");
  
    $registerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const role = document.getElementById("role").value;
      const user = User.createUser(name, email, role);
      alert("User registered successfully!");
  
      if (role === "Admin") {
        const adminUser = new AdminUser(name, email, role);
        adminUser.renderAdmin();
      } else {
        const regularUser = new RegularUser(name, email, role);
        regularUser.renderRegular();
      }
    });
  }
  
  function checkUserStatus() {
    const user = User.getCurrentUser();
    if (user) {
      if (user.role === "Admin") {
        const adminUser = new AdminUser(user.name, user.email, user.role);
        adminUser.renderAdmin();
      } else {
        const regularUser = new RegularUser(user.name, user.email, user.role);
        regularUser.renderRegular();
      }
    } else {
      registerForm();
    }
  }
  
  //Inicio del programa
  checkUserStatus();

