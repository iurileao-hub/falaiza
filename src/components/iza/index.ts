/**
 * Componentes da IZA - Assistente Virtual da Ouvidoria
 *
 * Exporta todos os componentes relacionados à IZA,
 * incluindo o sistema de classificação inteligente.
 */

// Avatar e mensagem base
export { IzaAvatar } from './IzaAvatar';
export { IzaMessage } from './IzaMessage';
export { IzaContainer } from './IzaContainer';

// Componentes de classificação inteligente
export { IzaSugestaoInteligente } from './IzaSugestaoInteligente';
export { SeletorComConfianca } from './SeletorComConfianca';
export {
  ConfiancaIndicator,
  ConfiancaBadge,
  getNivelConfianca,
  type NivelConfianca,
} from './ConfiancaIndicator';
export {
  PrivacidadeIndicator,
  PrivacidadeBadge,
} from './PrivacidadeIndicator';

// Componentes do modelo local (Camada 2)
export {
  ModeloLocalDownload,
  ModeloLocalBadge,
} from './ModeloLocalDownload';
