<template>
  <div id="post_container">
    <div class="post">
    <h3 class="date">{{date | DateFormatEN}}</h3>
    <h1>{{title}}</h1>
    <div class="content"
      v-if="postContent"
      v-html="postContent" />
    <a v-if="hasNewer" href="/" id="newer" class="blog-nav" @click.stop.prevent="push(newerPost)"><&nbsp;NEWER</a>
    <a v-if="hasOlder" href="/" id="older" class="blog-nav" @click.stop.prevent="push(olderPost)">OLDER&nbsp;></a>
  </div>
  <div id="container"></div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";
import fm from "front-matter";
import API from "../API";
import marked from "../utils/render.js";
import gitmentConfig from "../../gitmentConfig"

export default {
  data() {
    return {
      title: "",
      date: "",
      sha: ""
    };
  },
  computed: {
    ...mapState(["postList", "postContent"]),
    ...mapGetters(["hasNewer", "hasOlder", "newerPost", "olderPost"])
  },
  methods: {
    ...mapMutations(["setPostContent", "setCurrentPostIndexBySha"]),
    push(post) {
      this.$router.replace({ path: `/${post.date}/${post.title}/${post.sha}` });
    },
    gitmentRender() {
      const gitment = new Gitment({
        id: this.title,
        owner: gitmentConfig.owner,
        repo: gitmentConfig.repo,
        oauth: {
          client_id: gitmentConfig.client_id,
          client_secret: gitmentConfig.client_secret
        }
      });
      gitment.render("container");
    }
  },
  watch: {
    postList() {
      this.setCurrentPostIndexBySha(this.sha);
    }
  },
  beforeRouteEnter(to, from, next) {
    window.document.title = `${to.params.title}`;
    API.getDetail(to.params.sha)
      .then(text => {
        return marked(fm(text).body);
      })
      .then(postContent => {
        next(vm => {
          vm.setCurrentPostIndexBySha(to.params.sha);
          vm.setPostContent(postContent);
          vm.title = to.params.title;
          vm.date = to.params.date;
          vm.sha = to.params.sha;
          vm.gitmentRender();
        });
      })
      .catch(err => {
        console.log(err);
      });
  },
  beforeRouteUpdate(to, from, next) {
    window.document.title = `${to.params.title}`;
    API.getDetail(to.params.sha)
      .then(text => {
        this.setPostContent(marked(fm(text).body));
        this.setCurrentPostIndexBySha(to.params.sha);
        this.title = to.params.title;
        this.date = to.params.date;
        this.sha = to.params.sha;
        this.gitmentRender();
        next();
      })
      .catch(err => {
        console.log(err);
        next();
      });
  }
};
</script>



<style lang="scss" scoped>
.post {
  position: relative;
  padding-bottom: 30px;
  margin-bottom: 30px;
  border-bottom: 1px solid #e6e6e6;

  .date {
    font-size: 13px;
    color: #999;
    margin: 0 0 30px;
    letter-spacing: 1px;
  }

  h1 {
    font-size: 32px;
    margin: 0 0 45px;
    letter-spacing: 1px;
  }

  h1,
  h2 {
    text-transform: uppercase;
  }

  h3 {
    margin: 30px 0 15px;
  }

  .content {
    text-align: left;
    line-height: 1.8em;
  }

  #newer {
    left: 40px;
  }

  #older {
    right: 40px;
  }

  .blog-nav {
    position: fixed;
    bottom: 20px;
    height: 20px;
    line-height: 20px;
    font-family: "Montserrat", "Helvetica Neue", "Hiragino Sans GB", "LiHei Pro",
      Arial, sans-serif;
    font-size: 15px;
    color: #999;
    text-decoration: none;
    cursor: pointer;
    letter-spacing: 1px;
    border-bottom: 3px solid transparent;
  }

  .blog-nav:hover {
    color: #333;
    border-bottom-color: #333;
  }
}

@media screen and (max-width: 900px) {
  .post {
    padding-bottom: 80px;

    #newer {
      left: 0;
    }

    #older {
      right: 0;
    }

    .blog-nav {
      position: absolute;
      bottom: 30px;
    }
  }
}

@media screen and (max-width: 420px) {
  .post {
    .date {
      font-size: 12px;
      margin: 0 0 20px;
    }
    h1 {
      font-family: "Montserrat", "Helvetica Neue", "Hiragino Sans GB",
        "LiHei Pro", Arial, sans-serif;
      font-size: 24px;
      margin: 0 0 30px;
    }

    h3 {
      font-size: 16px;
      line-height: 1.3em;
    }
  }
}
</style>


<style lang="scss">
@import "prismjs/themes/prism-solarizedlight.css";

.post {
  color: #555;

  h1,
  h2 {
    text-transform: uppercase;
  }

  h2 {
    font-size: 24px;
    margin: 60px 0 30px;
    position: relative;

    &:before {
      content: "";
      border-left: 5px solid #f66;
      position: absolute;
      left: -15px;
      height: 75%;
      top: 12%;
    }
  }

  h3 {
    margin: 30px 0 15px;
  }

  p,
  ol,
  ul {
    margin: 1em 0 1.5em;
  }

  pre {
    background: #f7f7f7 !important;
    padding: 16px;
    overflow-x: auto;
    white-space: pre;
  }

  blockquote {
    margin: 2em 0;
    padding-left: 30px;
    border-left: 5px solid #e6e6e6;

    p {
      font-size: 17px;
      font-style: italic;
      line-height: 1.8em;
      color: #999;
    }
  }
  a {
    color: #f66;
    border-bottom: 2px solid transparent;

    &:hover {
      color: #f33;
      border-bottom-color: #f33;
    }
  }

  ul {
    padding-left: 15px;
    list-style-type: none;

    li {
      display: list-item;
      text-align: -webkit-match-parent;

      &:before {
        position: absolute;
        font-weight: 600;
        content: " · ";
        margin: 0;
        left: 0;
      }
    }
  }

  img {
    display: block;
    max-width: 100%;
    border: none;
  }

  code {
    font-family: "Roboto Mono", "Menlo", "Consolas", monospace;
    font-size: 13px;
    background-color: #f6f6f6;
    padding: 3px 10px;
    margin: 0 5px;
    border-radius: 2px;
  }

  strong {
    font-weight: 600;
    color: #444;
  }
}
</style>
