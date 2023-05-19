<script setup>
  import { ref, computed } from 'vue';
  import { useStore } from 'vuex';
  import { useSignMessage } from 'vagmi';

  const store = useStore();

  const imageFileUpload = ref(null)
  const statusMessage = ref('')
  const previewImage = ref(null)
  const saving = ref(false)
  const saveButton = ref('SAVE')

  const previewFile = computed({
    get: () => store.state.profile.value ? process.env.VUE_APP_BUCKET + store.state.profile.value.imageCid : previewImage
  })

  const imageFile = computed({
    get: () => store.state.profile.value.imageCid,
    set: newValue => store.commit('SET_PROFILE_FIELD', {key: 'imageCid', value: newValue})
  })

  const name = computed({
    get: () => store.state.profile.value.name,
    set: newValue => store.commit('SET_PROFILE_FIELD', {key: 'name', value: newValue})
  })

  const website = computed({
    get: () => store.state.profile.value.website,
    set: newValue => store.commit('SET_PROFILE_FIELD', {key: 'website', value: newValue})
  })

  const ens = computed({
    get: () => store.state.profile.value.ens,
    set: newValue => store.commit('SET_PROFILE_FIELD', {key: 'ens', value: newValue})
  })

  const bio = computed({
    get: () => store.state.profile.value.bio,
    set: newValue => store.commit('SET_PROFILE_FIELD', {key: 'bio', value: newValue})
  })

  const location = computed({
    get: () => store.state.profile.value.location,
    set: newValue => store.commit('SET_PROFILE_FIELD', {key: 'location', value: newValue})
  })

  const { signMessage } = useSignMessage({
    onSuccess(signature, vars) {
        store
          .dispatch('setProfile', { signature: signature, message: vars.message, formData: vars.formData })
          .then(() => {
            saveButton.value = "SAVED!"
            setTimeout(() => {
              saveButton.value = "SAVE"
              saving.value = false
            }, 1000)
          })
          .catch(err => {
            console.log("error saving profile", err)
            saveButton.value = "ERROR!"
          });
        }
  })

  function onFieldFocus (e) {
    const target = e.target
    if (target.value.includes('Please')) target.value = ''
  }

  function validateImage (img) {
    const height = img.height;
    const width = img.width;

    if (height < process.env.VUE_APP_MIN_IMAGE_DIMS
        || width < process.env.VUE_APP_MIN_IMAGE_DIMS
        || height > process.env.VUE_APP_MAX_IMAGE_DIMS
        || width > process.env.VUE_APP_MAX_IMAGE_DIMS)
    {
      // console.log("Height and Width must be between 500 and 3000.");
      statusMessage.value = process.env.VUE_APP_STATUS_MESSAGE
      return false;
    }
    if (height !== width) {
      // console.log("Image must be a square");
      statusMessage.value = process.env.VUE_APP_STATUS_MESSAGE
      return false;
    }
    return true;
  }

  function uploadImage () {
    imageFileUpload.value.click();
  }

  function handleImageUpload(e) {
    // in case accept prop isn't working for us
    // var regex = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg|.png|.gif)$");
    // if (regex.test(fileUpload.value.toLowerCase())) { }

    const tmpImage = e.target.files[0];
    if (tmpImage) {
      let reader = new FileReader
      reader.onload = evt => {
        const res = evt.target.result;
        const image = new Image();
        image.src = res;

        //Validate the File Height and Width.
        image.onload = () => {
          if (validateImage(image)) {
            previewImage.value = res
            imageFile.value = tmpImage
            statusMessage.value = ""
          }
        }
      }
      reader.readAsDataURL(tmpImage)
    }
  }

  function saveProfile() {
    // console.log("imageFile", imageFile.value)
    // console.log("name", name.value)
    // console.log("website", website.value)
    // console.log("ens", ens.value)
    // console.log("bio", bio.value)
    // console.log("store.state.account.address", store.state.account.address)
    if (imageFile.value
          && name.value
          && website.value
          && ens.value
          && bio.value
          && location.value
          && store.state.account.address) {
        let formData = new FormData();
        formData.append("image", imageFile.value)
        formData.append("name", name.value)
        formData.append("website", website.value)
        formData.append("ens", ens.value)
        formData.append("bio", bio.value)
        formData.append("location", location.value)
        formData.append("address", store.state.account.address)

          // for (const pair of formData.entries()) {
          //   console.log(`${pair[0]}, ${pair[1]}`);
          // }
          saveButton.value = "SAVING..."
          saving.value = true
          // need to first sign / authenticate
          if (!store.state.account.address || !store.state.isConnected) {
            console.log("Not connected. Can't sign message. Connect wallet.");
            return;
          }
          // const message = `Update profile`;
          // signMessage({ message, formData });
          // presign message to increment user nonce and return message for signing
          store
            .dispatch("preSign", { signingMessage: "signForProfileUpdate" })
            .then((message) => {
              signMessage({ message, formData });
            })
        }
        else {
          // if (!imageFile) addImage = true;
          if (!name.value) name.value = "Padd you namelease add your name"
          if (!website.value) website.value = "Please add a description"
          if (!ens.value) ens.value = "Please add an author"
          if (!bio.value) bio.value = "Please add a bio"
          if (!location.value) location.value = "Please add a location"
        }
      }
</script>

<style scoped>
  button {
    align-items: center;
    border-radius: 100px;
    font-weight: 600;
    padding: 12px 15px;
    border: 0;
    cursor: pointer;
    margin: 0 0 10px;
    height: 50px;
    width: 200px;
    transition: background-color .2s;
  }
  button.white {
    background-color: white;
    border: 1px var(--black) solid;
    display: block;
    position: relative;
    font-weight: 600;
    border-radius: 5px;
    margin: 13px 0;
    padding: 12px 15px;
    max-width: 200px;
    text-align: center;
  }
  button.white.del {
    background: red;
    color: white;
  }
  button:hover,
  button.saved {
    background-color: var(--yellow);
  }
  button svg {
    width: 15px;
    margin-right: 10px;
  }
  .buttons {
    display: flex;
    justify-content: space-between;
  }

  .status {
    color: var(--purple);
    text-align: center;
  }

  /* .button {
    border: 1px var(--black) solid;
    display: block;
    position: relative;
    font-weight: 600;
    border-radius: 5px;
    margin: 13px 0;
    padding: 12px 15px;
    max-width: 200px;
    text-align: center;
    cursor: pointer;
  } */
  /* .button.del {
    background: red;
    color: white;
  }
  .button:hover {
    opacity: .8;
  } */
  .row {
    display: flex;
    flex-direction: column;
    margin: 5px 0 10px;
  }
  .row.image {
    flex-direction: row;
    /* justify-content: center; */
    align-items: center;
    margin: 10px 0 10px;
  }
  .row label {
    margin: 10px 0 5px;
  }
  .row input {
    height: 30px;
    padding: 5px;
  }
  .row p {
    margin-bottom: 0;
  }
  .row.wallet {
    margin: 20px 0 10px;
  }
  .imagePreview {
    width: 120px;
    height: 120px;
    display: block;
    cursor: pointer;
    background-size: cover;
    background-position: center center;
  }
  .buttonContainer {
    width: 200px;
    margin-left: 30px;
    text-align: center;
  }
</style>
<template>
    <div class="profile-tab">
      <div class="row image">
        <div
          class="imagePreview"
          :style="{ 'background-image': `url(${previewImage ? previewImage : previewFile})` }"
          @click="uploadImage()">
        </div>
        <input
          type="file"
          accept=".jpg, .jpeg, .gif, .png"
          ref="imageFileUpload"
          style="display: none"
          @change="handleImageUpload( $event )"
          required
        />
        <div class="buttonContainer">
          <button
            @click="uploadImage()"
            tabIndex="0"
          >
            <svg role="img" viewBox="0 0 20 20" fill="none" stroke-width="1" stroke="#000" xmlns="http://www.w3.org/2000/svg"><g><title></title><path d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M14.1667 6.66667L10 2.5L5.83337 6.66667" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10 2.5V12.5" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>
            Upload Avatar
          </button>
          <div class="status">{{ statusMessage }}</div>
        </div>
      </div>
      <div class="row">
        <label for="name">Name</label>
        <input
          tabIndex="1" @focus="onFieldFocus($event)" v-model="name" type="text" maxlength='80' placeholder="Your Name" required />
      </div>
      <div class="row">
        <label for="website">Website</label>
        <input
          tabIndex="2" @focus="onFieldFocus($event)" v-model="website" type="url" maxlength='50' placeholder="https://example.com" required />
      </div>
      <div class="row">
        <label for="ens">ENS</label>
        <input
          tabIndex="3" @focus="onFieldFocus($event)" v-model="ens" type="url" maxlength='50' placeholder="https://example.eth" required />
      </div>
      <div class="row">
        <label for="bio">Bio</label>
        <input
          tabIndex="4" @focus="onFieldFocus($event)" v-model="bio" type="text" maxlength='80' placeholder="Something about yourself..." required />
      </div>
      <div class="row">
        <label for="location">Location</label>
        <input
          tabIndex="5" @focus="onFieldFocus($event)" v-model="location" type="text" maxlength='50' placeholder="Dev, Null" required />
      </div>
      <div class="buttons">
        <button
          tabIndex="6" class="white" :class="{saved: saving}" @click="saveProfile">{{ saveButton }}</button>
      </div>
    </div>
  </template>