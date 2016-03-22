<template>
  <library></library>
  <workbench></workbench>
  <project></project>
</template>

<script>
import Library   from './Library'
import Project   from './Project'
import Workbench from './Workbench'

export default
{ components:
  { Library
  , Project
  , Workbench
  }
}
</script>

<style lang='sass'>
@import "../assets/css/main.scss"
</style>
