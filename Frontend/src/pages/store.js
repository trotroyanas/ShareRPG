import {
    writable
} from 'svelte/store';

export const sto = writable(22);


/* Pour appeller dans une autre page */
/*
  import {sto} from "../../pages/store.js";
  let vv;

  sto.subscribe(value => (vv = value));
  console.log("*********");
  console.log(vv);
  console.log("*********");
 */

/*
   import {get} from "svelte/store";
   import {sto} from "../../pages/store.js";
   let vv = get(sto);
*/