export function isHexColor(form: string) : boolean {
    return !!/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/g.exec(form);
}