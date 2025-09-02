export interface AddressData {
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
}

export async function fetchAddressByCep(
  cep: string
): Promise<AddressData | null> {
  try {
    const response = await fetch(
      `https://viacep.com.br/ws/${cep.replace(/\D/g, "")}/json/`
    );
    const data = await response.json();
    if (data.erro) return null;
    return {
      address: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf,
    };
  } catch {
    return null;
  }
}
