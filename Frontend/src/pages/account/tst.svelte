<style>
  .wrapper {
    position: relative;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 10px;
    grid-auto-columns: minmax(100px, 150px);
    grid-auto-rows: minmax(100px auto);
    border: 1px solid red;
    width: 150px;
  }
  .one {
    grid-column: 1 / 3;
    grid-row: 1;
    border: 1px solid red;
    text-align: center;
    padding: 5px;
  }
  .two {
    grid-column: 1 / 1;
    grid-row: 2;
    border: 1px solid violet;
    padding: 2px;
  }
  .three {
    grid-column: 2/2;
    grid-row: 2;
    border: 1px solid blue;
    padding: 5px;
    text-align: right;
  }
  .four {
    grid-column: 1/3;
    grid-row: 3;
    border: 1px solid green;
    padding: 5px;
  }
  .five {
    grid-column: 1/3;
    grid-row: 4;
    border: 1px solid yellow;
    padding: 5px;
    text-align: center;
    line-height: 16px;
    padding-top: 80px;
    bottom: 0px;
  }
</style>

<div class="wrapper">
  <div class="one">Un</div>
  <div class="two">Deux</div>
  <div class="three">Trois</div>
  <div class="four">Quatre</div>
  <div class="five">Cinq</div>
</div>
