<script>
  export let checked = false;

  function toggle() {
    window.document.body.classList.toggle('dark-mode')
  }
</script>

<style>
  .switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 24px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #87CEEB;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 34px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: #FDB813;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }
	

  input:checked + .slider {
    background-color: #003366;
  }

  input:checked + .slider {
    box-shadow: 0 0 1px #2196f3;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
		position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: #F5F3CE;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
	/*box-shadow: 0 0 1px #000000;*/
  }
</style>

<label class="switch">
  <input type="checkbox" bind:checked on:click={toggle}/>
  <span class="slider" />
</label>