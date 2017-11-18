namespace NextBusNL
{
    partial class NextBusDialog
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.bussesLabel = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // bussesLabel
            // 
            this.bussesLabel.AutoSize = true;
            this.bussesLabel.Font = new System.Drawing.Font("Microsoft Sans Serif", 14F);
            this.bussesLabel.Location = new System.Drawing.Point(12, 9);
            this.bussesLabel.Name = "bussesLabel";
            this.bussesLabel.Size = new System.Drawing.Size(153, 24);
            this.bussesLabel.TabIndex = 0;
            this.bussesLabel.Text = "No busses found";
            // 
            // NextBusDialog
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(284, 167);
            this.Controls.Add(this.bussesLabel);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "NextBusDialog";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "NextBusNL";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label bussesLabel;
    }
}

