<template>
  <library></library>
  <workbench></workbench>
  <project></project>
</template>

<script>
import Library   from './components/Library'
import Project   from './components/Project'
import Workbench from './components/Workbench'

export default
{ components:
  { Library
  , Project
  , Workbench
  }
}
</script>

<style lang='sass'>
@import "./assets/css/main.scss"
</style>
