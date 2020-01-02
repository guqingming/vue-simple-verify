import { Vue } from 'vue-property-decorator'

declare module 'vue-simple-verify' {
  export interface SimpleVerify extends Vue {
    reset(): void;
  }
}
