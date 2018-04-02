<template>
  <div id="app">
    <div class="header">
      <a href="/" @click.stop.prevent="$router.push({ path: '/' })">NOT FIND YOU</a>
    </div>
    <p class="links">
      <a href="https://github.com/notfind" target="_blank" rel="noopener noreferrer nofollow">
        <img src="./assets/github.png">
      </a>
    </p>
  <main>
    <router-view/>
  </main>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import API from "./API";

export default {
  methods: {
    ...mapMutations(["setPostList"])
  },
  created() {
    API.getList()
      .then(list => {
        list.sort((a, b) => {
          if (a.date < b.date) {
            return 1
          }
          if (a.date > b.date) {
            return -1
          }
          return 0
        });
        this.setPostList(list);
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>

<style lang="scss">
$font-fmaily: "Roboto", "Helvetica Neue", "Hiragino Sans GB", "LiHei Pro", Arial,
  serif;

#app {
  font-family: $font-fmaily;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  text-rendering: optimizelegibility;
  -webkit-font-smoothing: antialiased;
}

.header,
h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: $font-fmaily;
  font-weight: 400;
  color: #444;
}

a {
  color: #666;
  text-decoration: none;
}

.header {
  letter-spacing: 5px;
  margin: 50px auto 15px;
  text-align: center;

  a {
    font-size: 15px;
    color: #444;
  }
}
@media screen and (max-width: 420px) {
  .header {
    margin: 40px auto 10px;
  }
}
.links {
  text-align: center;
  font-family: $font-fmaily;
  color: #999;
  font-size: 24px;
  margin: 0;

  a {
    cursor: pointer;
    padding: 2px;
    margin: 0 3px;
  }

  img {
    width: 15px;
    height: 15px;
    border: none;
  }
}

main {
  max-width: 600px;
  margin: 50px auto;
  padding: 0 30px 50px;
  position: relative;
}
@media screen and (max-width: 420px) {
  main {
    margin-top: 32px;
  }
}
</style>
