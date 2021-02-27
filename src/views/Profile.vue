<template>
    <div>
        <div class="text-center d-flex flex-row my-5">
            <v-avatar size="100" tile class="mr-4">
                <v-img :src="form.image" srcset lazy-src="@/assets/images/user.png" @error="imgError()" @load="imgLoad()"></v-img>
                <!-- <img src="@/assets/images/user.png"> -->
            </v-avatar>
            <v-text-field outlined dense :disabled="loading" label="Image URL" v-model="form.image"></v-text-field>
        </div>

        <br>
        
        <v-text-field outlined :disabled="loading" label="Name" placeholder="ใช้ชื่อตัวละครจริงเพื่อให้ผู้เล่นอื่นทราบ และสามารถเชิญคุณเข้าภารกิจ" v-model="form.name" :counter="25" maxlength="25"></v-text-field>

        <v-textarea outlined :disabled="loading" label="Description" placeholder=" " v-model="form.description" :counter="1000" maxlength="1000"></v-textarea>

        <div class="d-flex flex-no-wrap justify-space-between">
            <v-btn tile color="primary" :loading="loading" @click="save()">
                <v-icon class="mr-2">mdi-account-edit</v-icon> Update
            </v-btn>
            <v-btn tile text @click="resetForm()" :disabled="loading">Reset</v-btn>
            <v-btn tile text @click="$emit('onProfileUpdated')" :disabled="loading">ปิด</v-btn>
        </div>

        <v-snackbar v-model="snackbar.show">
            {{ snackbar.text }}
            <v-btn :color="snackbar.color" text @click="snackbar.show = false">Close</v-btn>
        </v-snackbar>

    </div>
</template>

<script>
    import firebase from 'firebase'
    export default {
        props: {
            start : { 
                type: Number,
                default: () => {
                    return 0
                }
            }
        },
        data() {
            return {
                loading: true,
                imageSuccess: true,
                form: {
                    image: '',
                    name: '',
                    description: '',
                },
                formStart: {},
                docRef: null,
                snackbar: {
                    text: '',
                    color: 'pink',
                    show: false,
                }
            }
        },
        watch: { 
            start: function(newVal, oldVal) {
                this.getProfile();
            }
        },
        mounted() {
            this.getProfile();
        },
        methods: {
            getProfile() {
                // console.log('getProfile',this.start);
                this.loading = true;
                var docRef = firebase.firestore().collection("users").doc(this.$store.getters.getUser.uid);
                docRef.get().then(doc => {
                    this.form.image = doc.data().image;
                    this.form.name = doc.data().name;
                    this.form.description = doc.data().description;
                    this.loading = false;
                    this.formStart = {...this.form};
                })
            },
            imgError() {
                this.imageSuccess = false;
            },
            imgLoad() {
                this.imageSuccess = true;
            },
            save() {
                if(!this.form.name)
                {
                    this.snackbar.text = 'ระบุชื่อตัวละคร';
                    this.snackbar.color = 'pink';
                    this.snackbar.show = true;
                    return ;
                }
                if(!this.imageSuccess)
                    this.form.image = this.formStart.image;

                const uid = this.$store.getters.getUser.uid;
                this.docRef = firebase.firestore().collection("users").doc(uid);
                this.docRef.update(this.form);
                
                this.$store.commit('updateProfile', this.form);

                this.$emit('onProfileUpdated');
            },
            resetForm() {
                // console.log('reset');
                
                this.form = {...this.formStart};
            }
        }
    }
</script>