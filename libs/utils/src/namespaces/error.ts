export enum ErrorMessage {
  InvalidCredentials = "InvalidCredentials",
  UserAlreadyExists = "UserAlreadyExists",
  SecretsNotFound = "SecretsNotFound",
  OAuthUser = "OAuthUser",
  InvalidResetToken = "InvalidResetToken",
  InvalidVerificationToken = "InvalidVerificationToken",
  EmailAlreadyVerified = "EmailAlreadyVerified",
  TwoFactorNotEnabled = "TwoFactorNotEnabled",
  TwoFactorAlreadyEnabled = "TwoFactorAlreadyEnabled",
  InvalidTwoFactorCode = "InvalidTwoFactorCode",
  InvalidTwoFactorBackupCode = "InvalidTwoFactorBackupCode",
  InvalidBrowserConnection = "InvalidBrowserConnection",
  ResumeSlugAlreadyExists = "ResumeSlugAlreadyExists",
  PortfolioSlugAlreadyExists = "PortfolioSlugAlreadyExists",
  ResumeNotFound = "ResumeNotFound",
  PortfolioNotFound = "PortfolioNotFound",
  ResumeLocked = "ResumeLocked",
  PortfolioLocked = "PortfolioLocked",
  ResumePrinterError = "ResumePrinterError",
  ResumePreviewError = "ResumePreviewError",
  PortfolioPreviewError = "PortfolioPreviewError",
  SomethingWentWrong = "SomethingWentWrong",
}
