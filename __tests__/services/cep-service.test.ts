import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchAddressByCep } from "@/services/cep-service";

// Mock do fetch global
global.fetch = vi.fn();

describe("CEP Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch address successfully for valid CEP", async () => {
    const mockResponse = {
      cep: "01001-000",
      logradouro: "Praça da Sé",
      complemento: "lado ímpar",
      bairro: "Sé",
      localidade: "São Paulo",
      uf: "SP",
      ibge: "3550308",
      gia: "1004",
      ddd: "11",
      siafi: "7107",
    };

    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchAddressByCep("01001000");

    expect(fetch).toHaveBeenCalledWith(
      "https://viacep.com.br/ws/01001000/json/"
    );
    expect(result).toEqual({
      address: "Praça da Sé",
      neighborhood: "Sé",
      city: "São Paulo",
      state: "SP",
    });
  });

  it("should handle CEP not found", async () => {
    const mockResponse = { erro: true };

    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchAddressByCep("99999999");

    expect(fetch).toHaveBeenCalledWith(
      "https://viacep.com.br/ws/99999999/json/"
    );
    expect(result).toBeNull();
  });

  it("should handle network errors", async () => {
    (fetch as any).mockRejectedValue(new Error("Network error"));

    const result = await fetchAddressByCep("01001000");

    expect(result).toBeNull();
  });

  it("should handle invalid CEP format", async () => {
    const mockResponse = { erro: true };

    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchAddressByCep("invalid");

    expect(fetch).toHaveBeenCalledWith("https://viacep.com.br/ws//json/");
    expect(result).toBeNull();
  });

  it("should handle empty CEP", async () => {
    const mockResponse = { erro: true };

    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchAddressByCep("");

    expect(fetch).toHaveBeenCalledWith("https://viacep.com.br/ws//json/");
    expect(result).toBeNull();
  });

  it("should clean CEP by removing non-digits", async () => {
    const mockResponse = {
      logradouro: "Rua Teste",
      bairro: "Bairro Teste",
      localidade: "Cidade Teste",
      uf: "TS",
    };

    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchAddressByCep("12.345-678");

    expect(fetch).toHaveBeenCalledWith(
      "https://viacep.com.br/ws/12345678/json/"
    );
    expect(result).toEqual({
      address: "Rua Teste",
      neighborhood: "Bairro Teste",
      city: "Cidade Teste",
      state: "TS",
    });
  });
});
