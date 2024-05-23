export type message = {
    Type: messageType,
    Body: any
} 

export enum messageType {
    popupOpen,
    formPref
}