<template>
  <div>
    <div class="navbar-fixed">
      <nav>
        <div class="nav-wrapper black">
          <!-- Logo -->
          <a href="#" class="times">{{ date | date("datetime") }}</a>

          <!-- Ícone para abrir no Mobile -->
          <a href="#" data-target="mobile-navbar" class="sidenav-trigger">
            <i class="material-icons">menu</i>
          </a>

          <ul id="navbar-items" class="right hide-on-med-and-down">
            <li>
              <router-link to="/">Home</router-link>
            </li>
            <li>
              <router-link to="/history">History</router-link>
            </li>
            <li>
              <router-link to="/statistics">Statistics</router-link>
            </li>
            <li>
              <router-link to="/users">Users</router-link>
            </li>
          </ul>
        </div>
      </nav>
    </div>

    <!-- Menu Mobile -->
    <ul id="mobile-navbar" class="sidenav">
      <li>
        <router-link to="/history">History</router-link>
      </li>
      <li>
        <router-link to="/">Home</router-link>
      </li>
      <li>
        <router-link to="/statistics">Statistics</router-link>
      </li>
      <li>
        <router-link to="/users">users</router-link>
      </li>
    </ul>

    <router-view />
  </div>
</template>

<script>
export default {
  mounted() {
    const elemsDropdown = document.querySelectorAll(".dropdown-trigger");
    const instancesDropdown = M.Dropdown.init(elemsDropdown, {
      coverTrigger: false
    });
    const elemsSidenav = document.querySelectorAll(".sidenav");
    const instancesSidenav = M.Sidenav.init(elemsSidenav, {
      edge: "left"
    });
    this.interval = setInterval(() => {
      this.date = new Date();
    });
  },
  data: () => ({
    date: new Date(),
    interval: null
  })
};
</script>
