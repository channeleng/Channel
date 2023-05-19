 <script>
    import Datepicker from '@vuepic/vue-datepicker'
    import '@vuepic/vue-datepicker/dist/main.css'
    import { QuillEditor } from '@vueup/vue-quill'
    import '@vueup/vue-quill/dist/vue-quill.snow.css'

    export default {
      name: 'Editor',
      components:{
        QuillEditor,
        Datepicker
      },
      props: {
        onPublished: Boolean,
        onError: Boolean
      },
      data() {
        return {
          pubDate: null,
          previewImage: null,
          imageFile: null,
          author: '',
          title: '',
          description: '',
          mediaFile: null,
          mediaTitle: 'Upload media',
          isPublishing: false,
          isError: false,
          addMedia: false,
          addImage: false,
          statusMessage: ''
        }
      },
      watch: {
        onPublished: function (newValue) {
          if (newValue) {
            this.resetFields();
            this.isPublishing = false;
          }
        },
        onError: function (newValue) {
            console.log("Editor Error", newValue)
          if (newValue) {
            this.isPublishing = false;
            this.isError = true;
          }
        }
      },
      methods: {
        onUpdate () {
          this.description = this.$refs.myEditor.getHTML();
        },
        onEditorReady (e) {
          e.container.fontStyle = 'normal';
          // e.container.querySelector('.ql-blank').style.cssText = 'font-style:normal';
          // e.container.querySelector('.ql-container').style.cssText = 'border: none;border-top:1px solid #e1e1e1;font-size:1.5em;font-style:normal !important;width:100%';
        },
        onEditorFocus () {
          if (this.description.includes('Please')) this.$refs.myEditor.setHTML('')
        },
        onFieldFocus (e) {
          const target = e.target
          if (target.value.includes('Please')) target.value = ''
        },
        validateImage (img) {
          var height = img.height;
          var width = img.width;

          if (height < process.env.VUE_APP_MIN_IMAGE_DIMS
              || width < process.env.VUE_APP_MIN_IMAGE_DIMS
              || height > process.env.VUE_APP_MAX_IMAGE_DIMS
              || width > process.env.VUE_APP_MAX_IMAGE_DIMS)
          {
            // console.log("Height and Width must be between 500 and 3000.");
            this.statusMessage = process.env.VUE_APP_STATUS_MESSAGE
            return false;
          }
          if (height !== width) {
            // console.log("Image must be a square");
            this.statusMessage = process.env.VUE_APP_STATUS_MESSAGE
            return false;
          }
          return true;
        },
        uploadImage () {
          this.$refs.imageFile.click();
        },
        uploadMedia () {
          this.$refs.mediaFile.click();
        },
        handleImageUpload(e) {

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
                if (this.validateImage(image)) {
                  this.previewImage = res
                  this.imageFile = tmpImage
                  this.statusMessage = ''
                }
                else {
                  console.log("Error. NOT validated")
                }
              }
            }
            reader.readAsDataURL(tmpImage)
          }
        },
        handleMediaUpload(e) {
        // in case accept prop isn't working for us
        // var regex = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(.m4a|.mp3)$");
        // if (regex.test(fileUpload.value.toLowerCase())) { }
          this.mediaFile = e.currentTarget.files[0];
          if (this.mediaFile) {
            this.mediaTitle = 'Upload ' + this.mediaFile.name
          }
        },
        publish () {
          if (this.$store.state.account.address
              && this.author
              && this.pubDate
              && this.title
              && this.description
              && this.imageFile
              && this.mediaFile ) {
                let formData = new FormData();
                formData.append("creatorAddress", this.$store.state.account.address)
                formData.append("author", this.author)
                formData.append("pubDate", this.pubDate.toISOString())
                formData.append("title", this.title)
                formData.append("description", this.description)
                formData.append("image", this.imageFile)
                formData.append("media", this.mediaFile)

                this.isPublishing = true;
                this.$emit('publish', formData);
              }
              else {
                if (!this.imageFile) this.addImage = true;
                if (!this.title) this.title = "Please add a title"
                if (!this.description)  this.$refs.myEditor.setHTML('Please add a description')
                if (!this.author) this.author = "Please add an author"
                if (!this.mediaFile) this.addMedia = true;
              }
        },
        resetFields () {
          this.pubDate = null
          this.previewImage = null
          this.imageFile = null
          this.author = ''
          this.title = ''
          this.description = ''
          this.$refs.myEditor.setHTML('')
          this.mediaFile = null
          this.mediaTitle = 'Upload media'
        }
      }
    }
  </script>

<template>
    <div id="editor">
      <div class="column">
        <div
          class="imagePreview"
          :style="{ 'background-image': `url(${previewImage})` }"
          @click="uploadImage()">
        </div>
        <input
          type="file"
          accept=".png, .jpg, .jpeg, .gif"
          ref="imageFile"
          style="display: none"
          required
          @change="handleImageUpload( $event )"
        />
        <div class="buttonContainer">
          <button
            :class="{alert: addImage}"
            @click="uploadImage()"
          >
            <svg role="img" viewBox="0 0 20 20" fill="none" stroke-width="1" stroke="#000" xmlns="http://www.w3.org/2000/svg"><g><title></title><path d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M14.1667 6.66667L10 2.5L5.83337 6.66667" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10 2.5V12.5" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>
            Upload Image
          </button>
          <div class="status">{{ statusMessage }}</div>
        </div>
      </div>
      <input
        v-model="title"
        class="title"
        type="text"
        placeholder="Enter title..."
        @focus="onFieldFocus($event)"
        required
      />
      <QuillEditor
        ref="myEditor"
        v-model="description"
        @update:content="onUpdate($event)"
        @ready="onEditorReady($event)"
        @focus="onEditorFocus()"
        theme="snow"
        placeholder="Enter description..."
        required
        :toolbar="[[{ size: [ 'small', false, 'large', 'huge' ]}], ['bold', 'italic', 'underline'], [{ 'list': 'ordered'}, { 'list': 'bullet' }], ['link']]"
      />
      <Datepicker v-model="pubDate" :enableTimePicker="false" ></Datepicker>
      <input
        v-model="author"
        class="author"
        type="text"
        placeholder="Enter author..."
        @focus="onFieldFocus($event)"
        required
      />
      <div class="row">
        <input
          type="file"
          accept=".mp3, .m4a"
          ref="mediaFile"
          style="display: none"
          required
          @change="handleMediaUpload( $event )"
        />
        <button
          @click="uploadMedia()"
        >
          <svg role="img" viewBox="0 0 20 20" fill="none" stroke-width="1" stroke="#000" xmlns="http://www.w3.org/2000/svg"><g><title></title><path d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M14.1667 6.66667L10 2.5L5.83337 6.66667" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10 2.5V12.5" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>
          <input
            :class="{alert: addMedia}"
            v-model="mediaTitle"
            type="text"
          />
        </button>
      </div>
      <!-- <input type"text" value="metadata" /> -->
      <div class="publishWrapper">
        <div
          class="meter"
          :class="{publishing: isPublishing, error: isError}"
        >
          <div>
            <svg role="img" viewBox="0 0 20 20" fill="none" stroke-width="1" stroke="#000" xmlns="http://www.w3.org/2000/svg"><g><title></title><path d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M14.1667 6.66667L10 2.5L5.83337 6.66667" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10 2.5V12.5" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>
            <span v-if="isPublishing">Publishing...</span>
            <span v-if="isError">Error publishing episode!</span>
          </div>
          <span></span>
        </div>
        <button
          class="publish"
          @click="publish()"
        >
          <svg role="img" viewBox="0 0 20 20" fill="none" stroke-width="1" stroke="#000" xmlns="http://www.w3.org/2000/svg"><g><title></title><path d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M14.1667 6.66667L10 2.5L5.83337 6.66667" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10 2.5V12.5" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>
          Publish
        </button>
      </div>
    </div>
  </template>

  <style scoped>
  #editor {
    width: 100%;
    height: 200px;
  }
  button {
    position: relative;
    display: flex;
    align-items: center;
    border-radius: 0;
    padding: 12px 15px;
    border: 0;
    width: 100%;
    cursor: pointer;
  }

  button.alert,
  input.alert {
    color: red;
  }

  .publish {
    background: var(--purple);
    color: white;
  }

  button.publish:hover {
    opacity: .8;
  }

  button svg,
  .meter svg {
    width: 15px;
    margin-right: 10px;
  }

  .status {
    color: var(--purple);
    text-align: left;
    padding: 10px 17px;
  }

  .meter svg {
    margin-right: 7px;
  }

  input[type=text] {
    border: none;
    width: 100%;
    font-size: 2em;
    padding: 15px;
  }
  input.title {
    border-left: 1px #e6e6e6 solid;
    border-right: 1px #e6e6e6 solid;
    font-size: 3em;
    font-weight: 700;
  }
  input.author {
    border-left: 1px #e6e6e6 solid;
    border-right: 1px #e6e6e6 solid;
    font-size: 2rem;
    font-weight: normal;
  }

  button input[type=text] {
    font-size: 14px;
    /* font-weight: 600; */
    background: transparent;
    margin: 0;
    padding: 0;
    pointer-events: none;
  }
  .imagePreview {
    width: 950px;
    height: 100px;
    display: block;
    cursor: pointer;
    background-size: cover;
    background-position: center center;
  }
  .column {
    border-left: 1px #e6e6e6 solid;
    border-right: 1px #e6e6e6 solid;
    display: flex;
    flex-direction: column;
  }
  .meter {
    display: none;
  }
  .meter.publishing,
  .meter.error {
    display: block;
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
  .meter > span {
    display: block;
    height: 40px;
    width: 100%;
    background-color: var(--purple);
    background-image: linear-gradient(to bottom, #baa3f0, #7323f4);
    /*background-color: rgb(43,194,83);
    background-image: linear-gradient(
      center bottom,
      rgb(43,194,83) 37%,
      rgb(84,240,84) 69%
    );*/
    box-shadow:
      inset 0 2px 9px  rgba(255,255,255,0.3),
      inset 0 -2px 6px rgba(0,0,0,0.4);
    position: relative;
    overflow: hidden;
  }

  .meter.error > span {
    background-image: linear-gradient(to bottom, rgba(253, 114, 114, .5), rgba(255, 0, 0, 0.548));
  }
  .meter > span:after {
    content: "";
    position: absolute;
    top: 0; left: 0; bottom: 0; right: 0;
    background-image: linear-gradient(
      -45deg,
      rgba(255, 255, 255, .2) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, .2) 50%,
      rgba(255, 255, 255, .2) 75%,
      transparent 75%,
      transparent
    );
    z-index: 1;
    background-size: 50px 50px;
    animation: move 2s linear infinite;
    overflow: hidden;
  }

  .meter.error > span:after {
    background-image: linear-gradient(to bottom, red, red);
    animation: none;
  }

  .meter > div {
    padding: 10px 15px;
    font-weight: 600;
    position: absolute;
    top: 0; left: 0; bottom: 0; right: 0;
    z-index: 2;
  }

  .publishWrapper {
    position: relative;
  }
  @keyframes move {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 50px 50px;
    }
  }
  </style>
