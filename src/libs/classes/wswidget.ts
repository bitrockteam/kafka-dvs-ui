import { Vue } from 'vue-property-decorator';

export default class WSWidget extends Vue {
  public socket: any = null;

  private destroyed() {
    this.socket.unsubscribe();
  }
}
