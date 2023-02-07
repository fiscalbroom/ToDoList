<script>
  import { slide } from "svelte/transition";
  import { elasticInOut } from "svelte/easing";
  import { onMount } from "svelte";

  let myTodo = [];


  async function getItems() {
    const response = await fetch("http://localhost:5001/items/all")

    const todo = await response.json();

    myTodo = todo.items
    console.log(myTodo)
  }

  onMount(async()=>{
    getItems();

  });

  let todos = [];
  let input = "";

  
  async function addItem() {
    let data = { item : input }
    const res = await fetch("http://localhost:5001/item/new", {
      method: 'POST',
      headers: { 'Content-Type' : 'application/json;charset=utf-8' },
      body: JSON.stringify(data)
    })

    const json = await res.json()
    let result = JSON.stringify(json)
    console.log(result);

    getItems();
  }

  function addTodo() {
    if (input)
      addItem()
    input = "";
  }

  

  async function removeTodo(id) {
    let data = { itemid : id }
    const res = await fetch("http://localhost:5001/item/remove", {
      method: 'DELETE',
      headers: { 'Content-Type' : 'application/json;charset=utf-8' },
      body: JSON.stringify(data)
    })

    getItems();
  }

  let darkMode = false;

  if (darkMode == true) {
    alert('Modalità scura attivata.');
  }
</script>

<svelte:head>
  <title>Svelte + Flask ToDoList</title>
  <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css"/>
  <script src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>
</svelte:head>

<main class="container is-fluid color-fondo">
  

  <div class="columns is-centered is-vcentered is-mobile">
    <div class="column is-narrow" style="width: 70%">

      <div class='info'>
        <p class="infoText">i<span class="infoTextSpan">ToDoList</span></p>
        <p class="description">Lista di cose da fare.</p>
      </div>

      

      <h1 class="has-text-centered title" style="margin-top: 10px;">ToDo List</h1>
      <form class="field has-addons" style="justify-content: center" on:submit|preventDefault={addTodo}>
        <div class="control">
          <input bind:value={input} class="input" type="text" placeholder="Aggiungi cose da fare">
        </div>
        <div class="control">
          <button class="button is-info">
            <span class="icon is-small">
              <i class="fas fa-plus"></i>
            </span>
          </button>
        </div>
      </form>
      <ul class:list={myTodo.length > 0} style="max-width: 500px; margin: 0 auto;">
        {#each myTodo as todo (todo.id)}
          <li class="list-item" transition:slide="{{duration: 300, easing: elasticInOut}}">
            <div class="is-flex" style="align-items: center;">
              <span class="is-pulled-left">{todo.item}</span>
              <div style="flex: 1"></div>
              <button class="button is-text is-pulled-right is-small" on:click={()=> removeTodo(todo.id)}>
                <span class="icon">
                  <i class="fas fa-check"></i>
                </span>
              </button>
            </div>
          </li>
        {:else}
          <li class="has-text-centered" transition:slide="{{delay: 0, duration: 300, easing: elasticInOut}}">Non ti è rimasto nulla da fare</li>
        {/each}
      </ul>
    </div>
  </div>
</main>

<style>
  .is-info {
    background-color: #87CEEB;
    transition: background-color 0.3s;
  }

  :global(body.dark-mode) .is-info {
    background-color: #003366;
    border: #252525 1px solid;
    transition: background-color 0.3s, border 0.3s;
  }

  .is-info:hover {
    background-color: #5abfe7;
  }

  :global(body.dark-mode) .is-info:hover {
    background-color: #002850;
    transition: background-color 0.3s;
  }

  :global(body.dark-mode) .title {
    color: #dde9f7;
  }

  :global(body.dark-mode) .input {
    background-color: #1A1A1A;
    color: #dde9f7;
    border-color: #252525;
    transition: background-color 0.3s, color 0.3s, border-color 0.3s;
  }

  :global(body.dark-mode) ::placeholder {
    color: #dde9f7;
  }

  .darkModeWrapper {
    margin: 0 auto;
  }

  .darkMode {
    margin-top: 10px;
    text-align: center;
  }

  .darkModeText {
    display: inline-block;
    vertical-align: middle;
  }

  :global(body.dark-mode) .darkModeText {
    color: white;
  }

  .darkModeSwitch {
    display: inline-block;
    vertical-align: middle;
  }

  .info {
    position: fixed;
    top: 2%;
    right: 2%;
    width: 50px;
    height: 50px;

    text-align: center;
    vertical-align: middle; 
    line-height: 50px;

    border-radius: 50px;
    background: #dde9f7;
    box-shadow: 6px 6px 12px #bcc6d2, 
                -6px -6px 12px #feffff;

    transition: background 0.3s, box-shadow 0.3s;
  }

  .info:hover {
    background: linear-gradient(145deg, #c7d2de, #ecf9ff);
  }

  :global(body.dark-mode) .info {
    background: #1A1A1A;
    box-shadow: 6px 6px 12px #121212, 
                -6px -6px 12px #2A2A2A;
  }

  :global(body.dark-mode) .info:hover {
    background: linear-gradient(145deg, #111111, #1c1c1c);
  }

  .infoText {
    font-weight: 700;
    font-size: 30px;
    font-family: Georgia, 'Times New Roman', Times, serif
  }

  .infoText:hover span{
    display:block;
}

  .infoTextSpan {
    border-radius: 30px;
    background: #dde9f7;
    box-shadow:  6px 6px 12px #bcc6d2, 
                -6px -6px 12px #feffff;
    position: fixed;
    top: 10%;
    right: 2%;
    width: 33%;
    height: 100px;
    display: none;
    font-family: sans-serif;
    padding: 0px 30px 10px 30px;
  }

  :global(body.dark-mode) .infoTextSpan {
    background: #1A1A1A;
    box-shadow: 6px 6px 12px #121212, 
                -6px -6px 12px #2A2A2A;
  }

  .description {
    font-size: 15px;
    line-height: 15px;
    text-align: left;
    padding: 0px 30px 10px 30px;
  }




  .color-fondo {
    background-color: #dde9f7;
    transition: background-color 0.3s
  }

  :global(body.dark-mode) .color-fondo {
    background-color: #1A1A1A;
  }

  main {
    height: 100%;
  }
</style>