<template>
  <div>
    <div class="shadow p-3 mb-5 pb-1 bg-light rounded">
      <h5>
        <font-awesome-icon icon="align-left" class="pb-1" />
        Live Feed
      </h5>
      <div class="p-3 bg-dark m-1 rounded">
        <code class="text-light mb-2" >
          <div>
            <ul class="list-unstyled mb-0 feed-class" v-chat-scroll="{smooth: false, always: false}">
              <li v-for="line in lines" 
                  :key="line.index"
                  class="mb-1">
                {{ line.message }}
              </li>
          </ul>
          </div>
        </code>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LogFeed',
  props: {
    msg: String
  },
  data() {
    return {
      lines: [{
        // 'message': 'test line'
      }]
    }
  },
  mounted () {
    this.$socket.on('new line', (data) => {
      this.lines.push({
        'message': data
      });
    });
  }
}
</script>

<style scoped>
  .feed-class {
    max-height: 150px;
    overflow-y: scroll;
  }
</style>
