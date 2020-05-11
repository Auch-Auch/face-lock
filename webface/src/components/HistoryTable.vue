<template>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>date</th>
        <th>Name</th>
        <th>Type</th>
        <th>confidence</th>
        <th>detail</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(post, idx) of posts" :key="post.id">
        <td>{{ idx + 1 }}</td>
        <td>{{ post.time }}</td>
        <td>{{ post.name }}</td>
        <td>
          <span :class="[post.typeClass]" class="white-text badge red"> access </span>
        </td>
        <td>{{ post.confidence }}</td>
        <td>
          <button class="btn-small btn black"  @click="$router.push('/detail/' + post.time)">
            <i class="material-icons">open_in_new</i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: ["posts"],
  data: () => ({
    access: true
  })
};
</script>
