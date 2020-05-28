export function isCarousel(message) {
  return Object.keys(message).includes('attachment')
    && Object.keys(message.attachment).includes('type')
    && message.attachment.type === 'template'
    && Object.keys(message.attachment).includes('payload')
    && Object.keys(message.attachment.payload).indexOf('template_type') >= 0
    && message.attachment.payload.template_type === 'generic'
    && Object.keys(message.attachment.payload).indexOf('elements') >= 0
    && message.attachment.payload.elements.length > 0;
}

export function isVideo(message) {
  debugger
  return Object.keys(message).includes('attachment')
  && Object.keys(message.attachment).includes('type')
  && message.attachment.type === 'video';
}

export function isImage(message) {
  debugger
  return Object.keys(message).includes('attachment')
  && Object.keys(message.msg_format_attr).includes('type')
  && message.msg_format_attr.type === 'image';
}

export function isGiphy(message) {
  debugger
  return Object.keys(message).includes('attachment')
  && Object.keys(message.msg_format_attr).includes('type')
  && message.msg_format_attr.type === 'giphy';
}

export function isText(message) {
  debugger
  return Object.keys(message).includes('text')
  && Object.keys(message).includes('attachment')
  && Object.keys(message).includes('msg_format_attr')
  && Object.keys(message.msg_format_attr).includes('type')
  && message.msg_format_attr.type === 'text';
}

export function isQR(message) {
  debugger
  return Object.keys(message).includes('text')
    && Object.keys(message).includes('msg_format_attr')
    && Object.keys(message.msg_format_attr).includes('type')
    && message.msg_format_attr.type === 'quick_reply';
}
