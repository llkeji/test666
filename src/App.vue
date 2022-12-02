<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
html,body,#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  min-width: 1300px;
  width: 100%;
  overflow: auto;
  margin: 0;
  padding: 0;
}
.box{
  text-align: left;
  margin: 20px auto;
}
.el-breadcrumb{
  margin: 10px auto;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
